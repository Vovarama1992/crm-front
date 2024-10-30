const TableHeaders: React.FC = () => (
  <thead className={'bg-gray-50'}>
    <tr>
      {[
        'Номер продажи',
        'Дата',
        'Что',
        'От кого',
        'Логистика',
        'Закупка',
        'Продажа',
        'Зашло',
        'Маржа',
        'Стадия доставки',
        'Стадия подписания',
        'Стадия сделки',
        'Дата проставления статуса',
        'Действия',
      ].map(header => (
        <th
          className={
            'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
          }
          key={header}
        >
          {header}
        </th>
      ))}
    </tr>
  </thead>
)

export default TableHeaders
