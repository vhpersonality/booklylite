<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel } from '@tanstack/table-core'
import type { Row } from '@tanstack/table-core'
import type { Member } from '~/types'
import { h, resolveComponent } from 'vue'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')

const columnFilters = ref([{
  id: 'name',
  value: ''
}])
const columnVisibility = ref()
const rowSelection = ref({})

const { data, status } = await useFetch<Member[]>('/api/members', {
  lazy: true
})

const q = ref('')

const filteredMembers = computed(() => {
  if (!data.value) return []
  if (!q.value) return data.value
  return data.value.filter((member) => {
    return member.name.toLowerCase().includes(q.value.toLowerCase()) ||
           member.username.toLowerCase().includes(q.value.toLowerCase()) ||
           member.specialty.toLowerCase().includes(q.value.toLowerCase())
  })
})

function getRowItems(row: Row<Member>) {
  return [
    {
      type: 'label',
      label: 'Действия'
    },
    {
      label: 'Редактировать сотрудника',
      icon: 'i-lucide-edit',
      onSelect: () => {
        toast.add({
          title: 'Редактирование',
          description: `Редактирование сотрудника ${row.original.name}`
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Просмотр услуг',
      icon: 'i-lucide-list'
    },
    {
      label: 'Просмотр расписания',
      icon: 'i-lucide-calendar'
    },
    {
      type: 'separator'
    },
    {
      label: 'Удалить сотрудника',
      icon: 'i-lucide-trash',
      color: 'error' as const,
      onSelect: () => {
        toast.add({
          title: 'Сотрудник удалён',
          description: `Сотрудник ${row.original.name} был удалён.`
        })
      }
    }
  ]
}

const columns: TableColumn<Member>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Выбрать все'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Выбрать строку'
      })
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Имя',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          ...row.original.avatar,
          size: 'lg'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.name),
          h('p', { class: 'text-sm text-muted' }, `@${row.original.username}`)
        ])
      ])
    }
  },
  {
    accessorKey: 'specialty',
    header: 'Специальность',
    cell: ({ row }) => {
      return h(UBadge, {
        variant: 'subtle',
        color: 'neutral' as const
      }, () => row.original.specialty)
    }
  },
  {
    accessorKey: 'servicesCount',
    header: 'Количество услуг',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'font-medium' }, row.original.servicesCount),
        h('span', { class: 'text-sm text-muted' }, 'услуг')
      ])
    }
  },
  {
    accessorKey: 'role',
    header: 'Роль',
    cell: ({ row }) => {
      const roleLabels = {
        'member': 'Сотрудник',
        'owner': 'Владелец'
      }
      
      const color = {
        'member': 'neutral' as const,
        'owner': 'primary' as const
      }[row.original.role]

      return h(UBadge, {
        variant: 'subtle',
        color
      }, () => roleLabels[row.original.role])
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]

const roleFilter = ref('all')

watch(() => roleFilter.value, (newVal) => {
  if (!table?.value?.tableApi) return

  const roleColumn = table.value.tableApi.getColumn('role')
  if (!roleColumn) return

  if (newVal === 'all') {
    roleColumn.setFilterValue(undefined)
  } else {
    roleColumn.setFilterValue(newVal)
  }
})

const name = computed({
  get: (): string => {
    return (table.value?.tableApi?.getColumn('name')?.getFilterValue() as string) || ''
  },
  set: (value: string) => {
    table.value?.tableApi?.getColumn('name')?.setFilterValue(value || undefined)
  }
})

const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})
</script>

<template>
  <UDashboardPanel id="employees">
    <template #header>
      <UDashboardNavbar title="Сотрудники">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            label="Пригласить сотрудника"
            color="neutral"
            icon="i-lucide-user-plus"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="q"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Поиск сотрудников..."
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <USelect
            v-model="roleFilter"
            :items="[
              { label: 'Все', value: 'all' },
              { label: 'Сотрудник', value: 'member' },
              { label: 'Владелец', value: 'owner' }
            ]"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            placeholder="Фильтр по роли"
            class="min-w-32"
          />
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Отображение"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        class="shrink-0"
        :data="filteredMembers"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0'
        }"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          Выбрано {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} из
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} строк(и).
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
