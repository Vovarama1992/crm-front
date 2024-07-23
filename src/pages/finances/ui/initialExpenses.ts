/* eslint-disable max-lines */
const initialCategories = [
  {
    category: 'Аренда Офис',
    subcategories: [
      {
        reports: [
          {
            author: 'Иван Иванов',
            date: '2024-07-01',
            expense: 5000,
            expense_id: 1,
            name: 'Аренда офисного помещения',
          },
          {
            author: 'Мария Сидорова',
            date: '2024-07-15',
            expense: 5200,
            expense_id: 2,
            name: 'Аренда офисного помещения',
          },
        ],
        subcategory: 'Аренда Офис',
      },
    ],
  },
  {
    category: 'Заработная плата ФОТ',
    subcategories: [
      {
        reports: [
          {
            author: 'Мария Сидорова',
            date: '2024-07-05',
            expense: 20000,
            expense_id: 3,
            name: 'Зарплата сотрудников',
          },
          {
            author: 'Петр Петров',
            date: '2024-07-20',
            expense: 21000,
            expense_id: 4,
            name: 'Зарплата сотрудников',
          },
        ],
        subcategory: 'Основные сотрудники',
      },
      {
        reports: [
          {
            author: 'Петр Петров',
            date: '2024-07-10',
            expense: 8000,
            expense_id: 5,
            name: 'Зарплата фрилансеров',
          },
          {
            author: 'Анна Иванова',
            date: '2024-07-25',
            expense: 8200,
            expense_id: 6,
            name: 'Зарплата фрилансеров',
          },
        ],
        subcategory: 'Внештатные сотрудники',
      },
      {
        reports: [
          {
            author: 'Анна Иванова',
            date: '2024-07-03',
            expense: 5000,
            expense_id: 7,
            name: 'Оплата услуг HR',
          },
          {
            author: 'Иван Иванов',
            date: '2024-07-18',
            expense: 5200,
            expense_id: 8,
            name: 'Оплата услуг HR',
          },
        ],
        subcategory: 'Оплата HR',
      },
    ],
  },
  {
    category: 'Налоговая нагрузка',
    subcategories: [
      {
        reports: [
          {
            author: 'Мария Сидорова',
            date: '2024-07-05',
            expense: 10000,
            expense_id: 9,
            name: 'Уплата налогов',
          },
          {
            author: 'Петр Петров',
            date: '2024-07-20',
            expense: 10200,
            expense_id: 10,
            name: 'Уплата налогов',
          },
        ],
        subcategory: 'Налоговая нагрузка',
      },
    ],
  },
  {
    category: 'Офисные расходы',
    subcategories: [
      {
        reports: [
          {
            author: 'Анна Иванова',
            date: '2024-07-03',
            expense: 300,
            expense_id: 11,
            name: 'Вода для кулера',
          },
          {
            author: 'Иван Иванов',
            date: '2024-07-18',
            expense: 320,
            expense_id: 12,
            name: 'Вода для кулера',
          },
        ],
        subcategory: 'Вода',
      },
      {
        reports: [
          {
            author: 'Иван Иванов',
            date: '2024-07-07',
            expense: 500,
            expense_id: 13,
            name: 'Покупка бумаги и ручек',
          },
          {
            author: 'Петр Петров',
            date: '2024-07-22',
            expense: 520,
            expense_id: 14,
            name: 'Покупка бумаги и ручек',
          },
        ],
        subcategory: 'Канцелярия',
      },
      {
        reports: [
          {
            author: 'Анна Иванова',
            date: '2024-07-05',
            expense: 1500,
            expense_id: 15,
            name: 'Оплата уборщицы',
          },
          {
            author: 'Иван Иванов',
            date: '2024-07-20',
            expense: 1520,
            expense_id: 16,
            name: 'Оплата уборщицы',
          },
        ],
        subcategory: 'Уборщица',
      },
      {
        reports: [
          {
            author: 'Мария Сидорова',
            date: '2024-07-07',
            expense: 300,
            expense_id: 17,
            name: 'Закупка чая и кофе',
          },
          {
            author: 'Петр Петров',
            date: '2024-07-22',
            expense: 320,
            expense_id: 18,
            name: 'Закупка чая и кофе',
          },
        ],
        subcategory: 'Чай кофе',
      },
      {
        reports: [
          {
            author: 'Анна Иванова',
            date: '2024-07-01',
            expense: 10000,
            expense_id: 19,
            name: 'Закупка нового стола',
          },
          {
            author: 'Иван Иванов',
            date: '2024-07-15',
            expense: 10500,
            expense_id: 20,
            name: 'Закупка нового стула',
          },
        ],
        subcategory: 'Закупка оборудования и мебели',
      },
      {
        reports: [
          {
            author: 'Анна Иванова',
            date: '2024-07-05',
            expense: 300,
            expense_id: 21,
            name: 'Прочие офисные расходы',
          },
          {
            author: 'Иван Иванов',
            date: '2024-07-20',
            expense: 320,
            expense_id: 22,
            name: 'Прочие офисные расходы',
          },
        ],
        subcategory: 'Прочие офисные расходы',
      },
    ],
  },
  {
    category: 'Расходы на IT',
    subcategories: [
      {
        reports: [
          {
            author: 'Анна Иванова',
            date: '2024-07-03',
            expense: 1500,
            expense_id: 23,
            name: 'Оплата интернета',
          },
          {
            author: 'Иван Иванов',
            date: '2024-07-18',
            expense: 1520,
            expense_id: 24,
            name: 'Оплата интернета',
          },
        ],
        subcategory: 'Интернет',
      },
      {
        reports: [
          {
            author: 'Иван Иванов',
            date: '2024-07-07',
            expense: 700,
            expense_id: 25,
            name: 'Оплата телефонии',
          },
          {
            author: 'Петр Петров',
            date: '2024-07-22',
            expense: 720,
            expense_id: 26,
            name: 'Оплата телефонии',
          },
        ],
        subcategory: 'Телефония',
      },
      {
        reports: [
          {
            author: 'Анна Иванова',
            date: '2024-07-03',
            expense: 3000,
            expense_id: 27,
            name: 'Оплата хостинга',
          },
          {
            author: 'Иван Иванов',
            date: '2024-07-18',
            expense: 3200,
            expense_id: 28,
            name: 'Оплата хостинга',
          },
        ],
        subcategory: 'Оплата хостинга',
      },
      {
        reports: [
          {
            author: 'Мария Сидорова',
            date: '2024-07-07',
            expense: 5000,
            expense_id: 29,
            name: 'Оплата CRM',
          },
          {
            author: 'Петр Петров',
            date: '2024-07-22',
            expense: 5200,
            expense_id: 30,
            name: 'Оплата CRM',
          },
        ],
        subcategory: 'Оплата CRM',
      },
      {
        reports: [
          {
            author: 'Анна Иванова',
            date: '2024-07-01',
            expense: 7000,
            expense_id: 31,
            name: 'Оплата специалистов',
          },
          {
            author: 'Иван Иванов',
            date: '2024-07-15',
            expense: 7500,
            expense_id: 32,
            name: 'Оплата специалистов',
          },
        ],
        subcategory: 'Привлечённые специалисты',
      },
      {
        reports: [
          {
            author: 'Анна Иванова',
            date: '2024-07-05',
            expense: 1500,
            expense_id: 33,
            name: 'Прочие IT расходы',
          },
          {
            author: 'Иван Иванов',
            date: '2024-07-20',
            expense: 1520,
            expense_id: 34,
            name: 'Прочие IT расходы',
          },
        ],
        subcategory: 'Прочие IT расходы',
      },
    ],
  },
  {
    category: 'Командировки',
    subcategories: [
      {
        reports: [
          {
            author: 'Мария Сидорова',
            date: '2024-07-01',
            expense: 3000,
            expense_id: 35,
            name: 'Командировка в Москву',
          },
          {
            author: 'Петр Петров',
            date: '2024-07-15',
            expense: 3200,
            expense_id: 36,
            name: 'Командировка в Санкт-Петербург',
          },
        ],
        subcategory: 'Командировки',
      },
    ],
  },
  {
    category: 'Прочие расходы',
    subcategories: [
      {
        reports: [
          {
            author: 'Анна Иванова',
            date: '2024-07-03',
            expense: 1500,
            expense_id: 37,
            name: 'Разные расходы',
          },
          {
            author: 'Иван Иванов',
            date: '2024-07-18',
            expense: 1520,
            expense_id: 38,
            name: 'Разные расходы',
          },
        ],
        subcategory: 'Прочие расходы',
      },
    ],
  },
]

export default initialCategories
