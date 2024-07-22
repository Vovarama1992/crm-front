export type WorkerDto = {
  address?: string // Адрес работника (необязательное поле)
  birthday: string // Дата рождения в формате YYYY-MM-DD
  cardNumber: string // Номер карты для перевода (если применимо)
  department?: string // Отдел (необязательное поле)
  dobNumber: string // Добавочный номер
  email: string // Электронная почта
  hireDate?: string // Дата принятия на работу (необязательное поле)
  manager?: string // Имя менеджера (необязательное поле)
  mobile: string // Мобильный телефон
  name: string // ФИО работника
  position: string // Должность
  roleName?: string
  salary?: string // Оклад сотрудника (необязательное поле)
  table_id: number // Уникальный идентификатор работника
}
