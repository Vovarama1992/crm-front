import React, { useState } from 'react'

import EditableForm, { PurchaseOrder } from './EditableForm'
import PurchaseTable from './PurchaseTable'
import { purchaseData } from './procurements'

export const ProcurementsPage: React.FC = () => {
  const [searchInvoice, setSearchInvoice] = useState('')
  const [searchManager, setSearchManager] = useState('')
  const [searchCustomer, setSearchCustomer] = useState('')
  const [priceRange, setPriceRange] = useState({ max: '', min: '' })
  const [data, setData] = useState<PurchaseOrder[]>(purchaseData)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null)
  const [editingIndex, setEditingIndex] = useState<null | number>(null)
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
    setPriceRange({
      ...priceRange,
      [e.target.name]: e.target.value,
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

  const handleAddNewRecord = () => {
    const maxIndex = data.length > 0 ? Math.max(...data.map((_, idx) => idx)) : -1

    setEditingOrder({
      creationDate: '',
      customer: '',
      customerInvoice: '',
      dealNumber: '',
      deliveryDeadline: '',
      invoiceLines: [],
      logisticsLines: [],
      manager: '',
      requestNumber: '',
      supplierLines: [],
    })
    setEditingIndex(maxIndex + 1)
    setIsFormOpen(true)
  }

  const handleSave = (newRecord: PurchaseOrder, index: null | number) => {
    if (index === null) {
      setData([...data, newRecord])
    } else {
      const updatedData = [...data]

      updatedData[index] = newRecord
      setData(updatedData)
    }
    setIsFormOpen(false)
    setEditingOrder(null)
    setEditingIndex(null)
  }

  const handleEditRecord = (record: PurchaseOrder, index: number) => {
    setEditingOrder(record)
    setEditingIndex(1)
    setIsFormOpen(true)
  }

  const filteredData = data.filter(order => {
    const matchesInvoice = order.customerInvoice.toLowerCase().includes(searchInvoice.toLowerCase())
    const matchesManager = order.manager.toLowerCase().includes(searchManager.toLowerCase())
    const matchesCustomer = order.customer.toLowerCase().includes(searchCustomer.toLowerCase())

    const orderTotalPrice = order.invoiceLines.reduce((sum, line) => sum + line.totalPrice, 0)
    const matchesPriceRange =
      (!priceRange.min || orderTotalPrice >= parseFloat(priceRange.min)) &&
      (!priceRange.max || orderTotalPrice <= parseFloat(priceRange.max))

    const isCompletedDeal = order.supplierLines.every(line => line.delivered)
    const hasIssues =
      order.supplierLines.some(line => {
        const currentDate = new Date()
        const shipmentDate = new Date(line.shipmentDate)

        return currentDate > shipmentDate && !line.delivered
      }) || new Date() > new Date(order.deliveryDeadline)

    const hasUnpaidInvoices = order.supplierLines.some(line => !line.paymentDate)

    return (
      matchesInvoice &&
      matchesManager &&
      matchesCustomer &&
      matchesPriceRange &&
      (!completedDealsOnly || isCompletedDeal) &&
      (!issuesOnly || hasIssues) &&
      (!unpaidSupplierInvoicesOnly || hasUnpaidInvoices)
    )
  })

  return (
    <div className={'absolute left-[15%] top-[15%]'}>
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

      <button
        className={'bg-blue-500 ml-[100px] text-white px-4 py-2 rounded mb-4'}
        onClick={handleAddNewRecord}
      >
        Добавить новую запись
      </button>

      <PurchaseTable data={filteredData} />

      {isFormOpen && editingOrder && editingIndex && (
        <EditableForm
          index={editingIndex}
          initialValue={editingOrder}
          onCancel={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

export default ProcurementsPage
