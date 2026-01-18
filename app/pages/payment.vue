<script setup lang="ts">
const selectedEmployees = ref<number>(3)
const selectedPeriod = ref<'1' | '3' | '6' | '12'>('12')

// Варианты количества сотрудников
const employeeOptions = [
  { label: 'до 3', value: 3 },
  ...Array.from({ length: 13 }, (_, i) => ({ label: String(i + 4), value: i + 4 })),
  { label: 'более 16', value: 16 }
]

// Тарифы
const plans = [
  {
    period: '1' as const,
    label: '1 месяц',
    pricePerMonth: 1650,
    bonus: null
  },
  {
    period: '3' as const,
    label: '3 месяца',
    pricePerMonth: 1650,
    bonus: null
  },
  {
    period: '6' as const,
    label: '6 месяцев',
    pricePerMonth: 1650,
    bonus: '+2 мес. бесплатно'
  },
  {
    period: '12' as const,
    label: '1 год',
    pricePerMonth: 1650,
    bonus: '+6 мес. бесплатно'
  }
]

// Расчет цены в зависимости от количества сотрудников
function getBasePrice(employees: number): number {
  // Базовая цена 1650₽/мес для до 3 сотрудников
  // Для большего количества сотрудников цена может увеличиваться
  // Сейчас используем базовую цену 1650₽ для всех вариантов
  // В будущем можно добавить дифференцированную цену
  return 1650
}

// Расчет общей стоимости с учетом срока и скидки
function getTotalPrice(employees: number, period: string): { monthly: number, total: number, bonusMonths?: number } {
  const basePrice = getBasePrice(employees)
  const months = Number.parseInt(period)
  
  // Бонусные месяцы (не влияют на цену, но показываются как подарок)
  let bonusMonths = 0
  
  if (period === '6') {
    bonusMonths = 2 // +2 мес. бесплатно
  } else if (period === '12') {
    bonusMonths = 6 // +6 мес. бесплатно
  }
  
  return {
    monthly: basePrice,
    total: basePrice * months,
    bonusMonths: bonusMonths > 0 ? bonusMonths : undefined
  }
}

const currentPrice = computed(() => getTotalPrice(selectedEmployees.value, selectedPeriod.value))

function handlePayment() {
  // Здесь будет логика оплаты
  const toast = useToast()
  toast.add({
    title: 'Переход к оплате',
    description: `Выбран тариф на ${plans.find(p => p.period === selectedPeriod.value)?.label} для ${selectedEmployees.value} сотрудников. Сумма: ${currentPrice.value.total}₽`,
    color: 'success'
  })
}
</script>

<template>
  <UDashboardPanel id="payment">
    <template #header>
      <UDashboardNavbar title="Оплата">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-8 max-w-5xl mx-auto py-8">
        <!-- Выбор количества сотрудников -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Количество сотрудников</h2>
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="option in employeeOptions"
              :key="option.value"
              :label="option.label"
              :color="selectedEmployees === option.value ? 'primary' : 'neutral'"
              :variant="selectedEmployees === option.value ? 'solid' : 'outline'"
              size="sm"
              @click="selectedEmployees = option.value"
            />
          </div>
        </div>

        <!-- Выбор срока лицензии -->
        <div>
          <h2 class="text-lg font-semibold mb-4">Срок лицензии</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UCard
              v-for="plan in plans"
              :key="plan.period"
              class="cursor-pointer transition-all hover:shadow-md"
              :class="{
                'ring-2 ring-yellow-400 ring-offset-2 bg-yellow-50 dark:bg-yellow-950/20': selectedPeriod === plan.period
              }"
              @click="selectedPeriod = plan.period"
            >
              <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-semibold">{{ plan.label }}</h3>
                </div>
                <div class="text-xl font-bold text-primary-600 mb-2">
                  {{ currentPrice.monthly }}₽/мес.
                </div>
                <div
                  v-if="plan.bonus"
                  class="mt-2 inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium"
                >
                  {{ plan.bonus }}
                </div>
              </div>
            </UCard>
          </div>
        </div>

        <!-- Итоговая информация -->
        <UCard class="bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4">Итого к оплате</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-muted">Тариф:</span>
                <span>{{ plans.find(p => p.period === selectedPeriod)?.label }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">Сотрудников:</span>
                <span>{{ selectedEmployees }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted">Цена в месяц:</span>
                <span>{{ currentPrice.monthly }}₽</span>
              </div>
              <div v-if="currentPrice.bonusMonths" class="flex justify-between text-sm text-primary-600">
                <span>Бонусные месяцы:</span>
                <span>+{{ currentPrice.bonusMonths }} мес. бесплатно</span>
              </div>
              <div class="border-t border-primary-200 dark:border-primary-800 pt-2 mt-2">
                <div class="flex justify-between text-lg font-bold">
                  <span>Итого:</span>
                  <span class="text-primary-600">{{ currentPrice.total }}₽</span>
                </div>
              </div>
            </div>
            <UButton
              color="primary"
              size="lg"
              block
              class="mt-6"
              @click="handlePayment"
            >
              Оплатить
            </UButton>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
