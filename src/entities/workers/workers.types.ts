export type WorkerDto = {
  address?: string // Адрес работника (необязательное поле)
  birthday?: string // Дата рождения в формате YYYY-MM-DD
  cardNumber?: string // Номер карты для перевода (если применимо)
  department_id: number | undefined // Отдел (необязательное поле)
  dobNumber: number | undefined // Добавочный номер
  email: string // Электронная почта
  hireDate?: string // Дата принятия на работу (необязательное поле)
  id: number // Уникальный идентификатор работника
  managed_by?: number // Имя менеджера (необязательное поле)
  margin_percent?: number
  middleName: string
  mobile?: string // Мобильный телефон
  name: string // ФИО работника
  position?: string // Должность
  roleName: string
  salary?: number // Оклад сотрудника (необязательное поле)
}
