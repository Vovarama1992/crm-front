import { WorkerDto } from '@/entities/workers'

export const workers: WorkerDto[] = [
  {
    birthday: '1970-01-01',
    cardNumber: '1111222233334444',
    department: null,
    dobNumber: '101',
    email: 'ivanov@example.com',
    mobile: '1234567890',
    name: 'Иван Иванов',
    position: 'Директор',
    roleName: 'Директор',
    table_id: 1,
  },
  {
    birthday: '1980-02-02',
    cardNumber: '5555666677778888',
    department: null,
    dobNumber: '102',
    email: 'petrov@example.com',
    mobile: '0987654321',
    name: 'Петр Петров',
    position: 'Закупщик',
    roleName: 'Закупщик',
    table_id: 2,
  },
  {
    birthday: '1990-03-03',
    cardNumber: '9999000011112222',
    department: null,
    dobNumber: '103',
    email: 'smirnova@example.com',
    mobile: '1122334455',
    name: 'Мария Смирнова',
    position: 'Бухгалтер',
    roleName: 'Бухгалтер',
    table_id: 3,
  },
  {
    birthday: '1985-04-04',
    cardNumber: '2222333344445555',
    department: 'Отдел продаж А',
    dobNumber: '104',
    email: 'sergeev@example.com',
    mobile: '6677889900',
    name: 'Сергей Сергеев',
    position: 'РОП',
    roleName: 'РОП',
    table_id: 4,
  },
  {
    birthday: '1992-05-05',
    cardNumber: '3333444455556666',
    department: 'Отдел продаж А',
    dobNumber: '105',
    email: 'alekseev@example.com',
    manager: 'Сергей Сергеев',
    mobile: '9988776655',
    name: 'Алексей Алексеев',
    position: 'Менеджер',
    roleName: 'Менеджер',
    table_id: 5,
  },
  {
    birthday: '1993-06-06',
    cardNumber: '7777888899990000',
    department: 'Отдел продаж А',
    dobNumber: '106',
    email: 'olgina@example.com',
    manager: 'Сергей Сергеев',
    mobile: '5544332211',
    name: 'Ольга Ольгина',
    position: 'Менеджер',
    roleName: 'Менеджер',
    table_id: 6,
  },
  {
    birthday: '1994-07-07',
    cardNumber: '1111222233334444',
    department: null,
    dobNumber: '107',
    email: 'dmitriev@example.com',
    mobile: '4455667788',
    name: 'Дмитрий Дмитриев',
    position: 'Менеджер',
    roleName: 'Менеджер',
    table_id: 7,
  },
  {
    birthday: '1995-08-08',
    cardNumber: '5555666677778888',
    department: 'Отдел продаж B',
    dobNumber: '108',
    email: 'elenina@example.com',
    manager: 'Сергей Сергеев',
    mobile: '2233445566',
    name: 'Елена Еленина',
    position: 'Менеджер',
    roleName: 'Менеджер',
    table_id: 8,
  },
  {
    birthday: '1986-09-09',
    cardNumber: '9999000011112222',
    department: 'Отдел продаж B',
    dobNumber: '109',
    email: 'nikolaev@example.com',
    mobile: '3322114455',
    name: 'Николай Николаев',
    position: 'РОП',
    roleName: 'РОП',
    table_id: 9,
  },
  {
    birthday: '1996-09-09',
    cardNumber: '8888777766665555',
    department: null, // Не входит в отделы продаж
    dobNumber: '110',
    email: 'annova@example.com',
    mobile: '1112223344',
    name: 'Анна Аннова',
    position: 'Менеджер',
    roleName: 'Менеджер',
    table_id: 10,
  },
]

export default workers
