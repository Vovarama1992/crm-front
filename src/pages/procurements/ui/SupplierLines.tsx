/* eslint-disable max-lines */
/* eslint-disable no-constant-condition */
import React, { useEffect, useState } from 'react'

import {
  useDeleteSupplierLineMutation,
  useGetSupplierLinesByPurchaseIdQuery,
  useUpdateSupplierLineMutation,
} from '@/entities/deal'
import { SupplierLineDto } from '@/entities/deal/deal.types'
import { useGetSuppliersQuery } from '@/entities/departure/departure.api'
import { useUploadSupplierPdfMutation } from '@/entities/session'

import CreateSupplierLineModal from './CreateSupplierLineModal'

const apiUrl = import.meta.env.VITE_APP_API_URL || 'https://oldkns.webtm.ru/api'

interface SupplierLinesProps {
  onTotalChange: (total: number) => void
  purchaseId: number
}

const SupplierLines: React.FC<SupplierLinesProps> = ({ onTotalChange, purchaseId }) => {
  const { data: supplierLines = [] } = useGetSupplierLinesByPurchaseIdQuery(purchaseId)
  const { data: suppliers = [] } = useGetSuppliersQuery() // Получаем список поставщиков
  const [updateSupplierLine] = useUpdateSupplierLineMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localSupplierLines, setLocalSupplierLines] = useState<SupplierLineDto[]>([])
  const [deleteSupplierLine] = useDeleteSupplierLineMutation()

  // Хуки для загрузки и скачивания PDF
  const [uploadSupplierPdf] = useUploadSupplierPdfMutation()

  const handleDeleteLine = async (lineId: number) => {
    try {
      await deleteSupplierLine(lineId).unwrap()
      setLocalSupplierLines(prevLines => prevLines.filter(line => line.id !== lineId))

      const total = localSupplierLines.reduce((sum, line) => {
        return sum + line.totalPurchaseAmount * (line.quantity || 0)
      }, 0)

      onTotalChange(total)
    } catch (error) {
      console.error('Ошибка при удалении строки поставщика:', error)
    }
  }

  useEffect(() => {
    setLocalSupplierLines(supplierLines)

    const total = supplierLines.reduce((sum, line) => {
      return sum + line.totalPurchaseAmount * (line.quantity || 0)
    }, 0)

    onTotalChange(total)
  }, [supplierLines, onTotalChange])

  // Функция для нахождения имени поставщика по его ID
  const findSupplierName = (supplierId: number) => {
    const supplier = suppliers.find(supplier => supplier.id === supplierId)

    return supplier ? supplier.name : 'Неизвестный поставщик'
  }

  const handleAddLines = (newLines: SupplierLineDto[]) => {
    const sanitizedLines = newLines.map(({ id, ...rest }) => rest)
    const updatedLines = [...localSupplierLines, ...sanitizedLines]

    setLocalSupplierLines([...localSupplierLines, ...newLines])

    const newTotal = updatedLines.reduce((sum, line) => {
      return sum + line.totalPurchaseAmount * (line.quantity || 0)
    }, 0)

    onTotalChange(newTotal)
  }

  const handleFieldChange = async (lineId: number, field: keyof SupplierLineDto, value: any) => {
    try {
      let updateValue = value

      if ((field === 'shipmentDate' || field === 'paymentDate') && typeof value === 'string') {
        updateValue = new Date(value).toISOString()
      }

      const updatedLines = localSupplierLines.map(line =>
        line.id === lineId ? { ...line, [field]: updateValue } : line
      )

      setLocalSupplierLines(updatedLines)

      if (field === 'quantity') {
        updateValue = Number(value)
      }

      await updateSupplierLine({ data: { [field]: updateValue }, id: lineId })
    } catch (error) {
      console.error(`Ошибка обновления поля ${field}:`, error)
    }
  }

  const handleFileUpload = async (lineId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      try {
        await uploadSupplierPdf({ file, supplierLineId: String(lineId) }).unwrap()

        const pdfUrl = `${apiUrl}/files/download/supplier-pdf/supplier_${lineId}.pdf`

        await handleFieldChange(lineId, 'pdfUrl', pdfUrl)
      } catch (error) {
        console.error('Ошибка при загрузке PDF:', error)
      }
    }
  }

  const handleFileDownload = (pdfUrl: string) => {
    try {
      // Открытие PDF напрямую по URL в новой вкладке
      window.open(pdfUrl, '_blank')
    } catch (error) {
      console.error('Ошибка при открытии PDF:', error)
    }
  }

  const uniqueLines = (lines: any) => {
    const uniqueMap = new Map()

    lines.forEach((line: any) => {
      const key = `${line.articleNumber}-${line.description}-${line.quantity}-${line.totalPurchaseAmount}-${line.paymentDate}-${line.shipmentDate}-${line.supplierInvoice}-${line.comment}`

      if (uniqueMap.has(key)) {
        const existingLine = uniqueMap.get(key)

        if (existingLine.id && line.id) {
          uniqueMap.set(`${key}-${line.id}`, line)
        }
      } else {
        uniqueMap.set(key, line)
      }
    })

    return Array.from(uniqueMap.values()).sort((a: any, b: any) => {
      const dateA = new Date(a.shipmentDate).getTime()
      const dateB = new Date(b.shipmentDate).getTime()

      return dateA - dateB
    })
  }

  return (
    <div className={'mb-4'}>
      <h3 className={'font-medium'}>Строки поставщиков</h3>

      <table className={'table-auto w-full border-collapse'}>
        <thead>
          <tr>
            <th className={'border px-4 py-2'}>Артикул</th>
            <th className={'border px-4 py-2'}>Описание</th>
            <th className={'border px-4 py-2'}>Кол-во</th>
            <th className={'border px-4 py-2'}>Сумма</th>
            <th className={'border px-4 py-2'}>Поставщик</th>
            <th className={'border px-4 py-2'}>Дата оплаты</th>
            <th className={'border px-4 py-2'}>Дата отгрузки</th>
            <th className={'border px-4 py-2'}>Доставлено</th>
            <th className={'border px-4 py-2'}>Счёт поставщика</th>
            <th className={'border px-4 py-2'}>Комментарий</th>
            <th className={'border px-4 py-2'}>Дней до оплаты</th>
            <th className={'border px-4 py-2'}>Дней до отгрузки</th>
          </tr>
        </thead>
        <tbody>
          {uniqueLines(localSupplierLines).map((line: SupplierLineDto) => {
            const today = new Date()
            const paymentDate = new Date(line.paymentDate)
            const shipmentDate = new Date(line.shipmentDate)

            const daysToPayment = Math.floor(
              (paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            )
            const daysToShipment = Math.floor(
              (shipmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
            )

            return (
              <tr key={line.id}>
                <td className={'border px-4 py-2'}>{line.articleNumber}</td>
                <td className={'border px-4 py-2'}>{line.description}</td>
                <td className={'border px-4 py-2'}>
                  <input
                    className={'border p-2 w-[65px]'}
                    onChange={e => handleFieldChange(line.id, 'quantity', e.target.value)}
                    type={'text'}
                    value={line.quantity}
                  />
                </td>
                <td className={'border px-4 py-2'}>{line.totalPurchaseAmount}</td>

                <td className={'border px-4 py-2'}>{findSupplierName(line.supplierId)}</td>
                <td className={'border px-4 py-2'}>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.paymentDate?.substring(0, 10)}
                    onChange={e => handleFieldChange(line.id, 'paymentDate', e.target.value)}
                    type={'date'}
                  />
                </td>

                <td className={'border px-4 py-2'}>
                  <input
                    className={'border p-2 w-full'}
                    defaultValue={line.shipmentDate?.substring(0, 10)}
                    onChange={e => handleFieldChange(line.id, 'shipmentDate', e.target.value)}
                    type={'date'}
                  />
                </td>

                <td className={'border px-4 py-2'}>
                  <input
                    checked={line.delivered}
                    onChange={e => handleFieldChange(line.id, 'delivered', e.target.checked)}
                    type={'checkbox'}
                  />
                </td>

                <td className={'border px-4 py-2 w-[40px]'}>
                  {line.pdfUrl ? (
                    <button
                      className={'text-blue-500 underline'}
                      onClick={() => handleFileDownload(line.pdfUrl as string)}
                      type={'button'}
                    >
                      Открыть PDF
                    </button>
                  ) : (
                    <input onChange={e => handleFileUpload(line.id, e)} type={'file'} />
                  )}
                </td>

                <td className={'border px-4 py-2'}>
                  <textarea
                    className={'border p-2 w-full'}
                    onChange={e => handleFieldChange(line.id, 'comment', e.target.value)}
                    title={line.comment}
                    value={line.comment}
                  />
                </td>
                {/* Дни до оплаты */}
                <td
                  className={'border px-4 py-2'}
                  title={
                    daysToPayment >= 0
                      ? `${daysToPayment} дней осталось до оплаты`
                      : 'Срок оплаты истек'
                  }
                >
                  {daysToPayment >= 0 ? `${daysToPayment} дней` : 'Срок истек'}
                </td>
                {/* Дни до отгрузки */}
                <td
                  className={'border px-4 py-2'}
                  title={
                    daysToShipment >= 0
                      ? `${daysToShipment} дней осталось до отгрузки`
                      : 'Срок отгрузки истек'
                  }
                >
                  {daysToShipment >= 0 ? `${daysToShipment} дней` : 'Срок истек'}
                </td>

                <td className={'border px-4 py-2'}>
                  <button
                    className={'bg-red-500 text-white px-2 py-1 rounded'}
                    onClick={() => handleDeleteLine(line.id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <button
        className={'bg-green-500 ml-[300px] text-white px-4 py-2 rounded mt-4'}
        onClick={() => setIsModalOpen(true)}
      >
        Добавить строку поставщика
      </button>

      {isModalOpen && (
        <CreateSupplierLineModal
          onCancel={() => setIsModalOpen(false)}
          onSuccess={handleAddLines} // Оптимистично обновляем строки на фронте
          purchaseId={purchaseId}
        />
      )}
    </div>
  )
}

export default SupplierLines
