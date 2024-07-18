import React, { useState } from 'react'

import Modal from './Modal'
import PurchaseTable from './PurchaseTable'
import { PurchaseOrder } from './PurchaseTable'
import { purchaseData } from './procurements'

export const ProcurementsPage: React.FC = () => {
  const [searchInvoice, setSearchInvoice] = useState('')
  const [searchManager, setSearchManager] = useState('')
  const [searchCustomer, setSearchCustomer] = useState('')
  const [priceRange, setPriceRange] = useState({ max: '', min: '' })
  const [data, setData] = useState<PurchaseOrder[]>(purchaseData)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    setPriceRange({
      ...priceRange,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddNewRecord = (newRecord: PurchaseOrder) => {
    setData([...data, newRecord])
  }

  const filteredData = data.filter(order => {
    const matchesInvoice = order.customerInvoice.toLowerCase().includes(searchInvoice.toLowerCase())
    const matchesManager = order.manager.toLowerCase().includes(searchManager.toLowerCase())
    const matchesCustomer = order.customer.toLowerCase().includes(searchCustomer.toLowerCase())

    const orderTotalPrice = order.invoiceLines.reduce((sum, line) => sum + line.totalPrice, 0)
    const matchesPriceRange =
      (!priceRange.min || orderTotalPrice >= parseFloat(priceRange.min)) &&
      (!priceRange.max || orderTotalPrice <= parseFloat(priceRange.max))

    return matchesInvoice && matchesManager && matchesCustomer && matchesPriceRange
  })

  return (
    <div className={'absolute left-[5%] top-[5%]'}>
      <h2 className={'text-xl font-bold mt-4'}>Таблица закупок</h2>

      <div className={'filters mb-4'}>
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

      <button
        className={'bg-blue-500 ml-[100px] text-white px-4 py-2 rounded mb-4'}
        onClick={() => setIsModalOpen(true)}
      >
        Добавить новую запись
      </button>

      <PurchaseTable data={filteredData} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddNewRecord}
      />
    </div>
  )
}
