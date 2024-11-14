import React, { useState } from 'react'

import { useGetAllCounterpartiesQuery, useGetAllPurchasesQuery } from '@/entities/deal'
import { useGetWorkersQuery } from '@/entities/workers'

import PurchaseTable from './PurchaseTable'

export const ProcurementsPage: React.FC = () => {
  const { data: purchaseData = [] } = useGetAllPurchasesQuery()
  const { data: counterparties = [] } = useGetAllCounterpartiesQuery() // Получаем всех контрагентов
  const { data: workers = [] } = useGetWorkersQuery() // Получаем всех сотрудников

  const [searchInvoice, setSearchInvoice] = useState('')
  const [searchManager, setSearchManager] = useState('')
  const [searchCustomer, setSearchCustomer] = useState('')
  const [priceRange, setPriceRange] = useState({ max: '', min: '' })
  const [completedDealsOnly, setCompletedDealsOnly] = useState(false)
  const [issuesOnly, setIssuesOnly] = useState(false)
  const [unpaidSupplierInvoicesOnly, setUnpaidSupplierInvoicesOnly] = useState(false)

  const handleSearchInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInvoice(e.target.value)
  }

  const handleSearchManagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchManager(e.target.value)
  }

  const handleSearchCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCustomer(e.target.value)
  }

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setPriceRange({
      ...priceRange,
      [name]: value,
    })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = e.target

    if (name === 'completedDealsOnly') {
      setCompletedDealsOnly(checked)
    } else if (name === 'issuesOnly') {
      setIssuesOnly(checked)
    } else if (name === 'unpaidSupplierInvoicesOnly') {
      setUnpaidSupplierInvoicesOnly(checked)
    }
  }

  // Функция для получения имени контрагента по ID
  const getCounterpartyName = (id: number) => {
    const counterparty = counterparties.find(c => c.id === id)

    return counterparty ? counterparty.name : 'Неизвестный контрагент'
  }

  // Функция для получения имени сотрудника по ID
  const getWorkerName = (id: number) => {
    const worker = workers.find(w => w.id === id)

    return worker ? worker.name + ' ' + worker.surname : 'Неизвестный сотрудник'
  }

  // Фильтрация данных
  const filteredData = purchaseData.filter(purchase => {
    const matchesInvoice = purchase.requestNumber
      .toLowerCase()
      .includes(searchInvoice.toLowerCase())
    const matchesManager =
      searchManager === '' ||
      getWorkerName(purchase.userId).toLowerCase().includes(searchManager.toLowerCase())
    const matchesCustomer =
      searchCustomer === '' ||
      getCounterpartyName(purchase.counterpartyId)
        .toLowerCase()
        .includes(searchCustomer.toLowerCase())
    const matchesPriceRange =
      (!priceRange.min || purchase.invoiceToCustomer >= parseFloat(priceRange.min)) &&
      (!priceRange.max || purchase.invoiceToCustomer <= parseFloat(priceRange.max))

    // Убедитесь, что логистические линии и линии поставщиков определены и являются массивами
    const matchesCompletedDealsOnly =
      !completedDealsOnly ||
      (purchase.logisticsLines && purchase.logisticsLines.some(line => line.date && line.amount))
    const matchesIssuesOnly =
      !issuesOnly ||
      (purchase.supplierLines && purchase.supplierLines.some(line => !line.delivered))
    const matchesUnpaidSupplierInvoicesOnly =
      !unpaidSupplierInvoicesOnly ||
      (purchase.supplierLines && purchase.supplierLines.some(line => !line.paymentDate))

    return (
      matchesInvoice &&
      matchesManager &&
      matchesCustomer &&
      matchesPriceRange &&
      matchesCompletedDealsOnly &&
      matchesIssuesOnly &&
      matchesUnpaidSupplierInvoicesOnly
    )
  })

  return (
    <div className={'absolute left-[2%] top-[5%]'}>
      <h2 className={'text-xl font-bold mt-4'}>Таблица закупок</h2>

      <div className={'ml-[100px] filters mb-4'}>
        <input
          className={'border p-2 mr-2'}
          onChange={handleSearchInvoiceChange}
          placeholder={'Поиск по счету'}
          type={'text'}
          value={searchInvoice}
        />
        <input
          className={'border p-2 mr-2'}
          onChange={handleSearchManagerChange}
          placeholder={'Поиск по менеджеру'}
          type={'text'}
          value={searchManager}
        />
        <input
          className={'border p-2 mr-2'}
          onChange={handleSearchCustomerChange}
          placeholder={'Поиск по заказчику'}
          type={'text'}
          value={searchCustomer}
        />
        <input
          className={'border p-2 mr-2'}
          name={'min'}
          onChange={handlePriceRangeChange}
          placeholder={'Мин. цена'}
          type={'number'}
          value={priceRange.min}
        />
        <input
          className={'border p-2'}
          name={'max'}
          onChange={handlePriceRangeChange}
          placeholder={'Макс. цена'}
          type={'number'}
          value={priceRange.max}
        />
      </div>

      <div className={'ml-[200px] filters mb-4'}>
        <label className={'mr-4'}>
          <input
            checked={completedDealsOnly}
            name={'completedDealsOnly'}
            onChange={handleCheckboxChange}
            type={'checkbox'}
          />
          Завершенные сделки
        </label>
        <label className={'mr-4'}>
          <input
            checked={issuesOnly}
            name={'issuesOnly'}
            onChange={handleCheckboxChange}
            type={'checkbox'}
          />
          Проблемы с заказом
        </label>
        <label className={'mr-4'}>
          <input
            checked={unpaidSupplierInvoicesOnly}
            name={'unpaidSupplierInvoicesOnly'}
            onChange={handleCheckboxChange}
            type={'checkbox'}
          />
          Счета поставщика не оплачены
        </label>
      </div>

      <PurchaseTable
        data={filteredData.map(purchase => ({
          ...purchase,
          counterpartyName: getCounterpartyName(purchase.counterpartyId),
          managerName: getWorkerName(purchase.userId),
        }))}
      />
    </div>
  )
}

export default ProcurementsPage
