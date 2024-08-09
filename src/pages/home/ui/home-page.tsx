import type { AuthContext } from '@/app/providers/router/types'

import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'

import { useAskNlpMutation, useCloseDialogueMutation, useMeQuery } from '@/entities/session'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { Typography } from '@/shared/ui/typography'

import Modal from './Modal'

enum PermissionsEnum {
  COMMON_SALES = 'common_sales',
  CONTRAGENTS = 'contragents',
  DEPARTURES = 'departures',
  FINANCES = 'finances',
  MY_SALES = 'my_sales',
  PROCUREMENTS = 'procurements',
  SALARY_REPORTS = 'salary_reports',
  SALES_LIST = 'contragents',
  SUMMARY_TABLE = 'summary_table',
  SUPPLIERS = 'suppliers',
}

const permissionLinks = [
  { label: 'Контрагент', path: ROUTER_PATHS.CONTRAGENTS, permission: PermissionsEnum.CONTRAGENTS },
  {
    label: 'Сводная таблица',
    path: ROUTER_PATHS.SUMMARY_TABLE,
    permission: PermissionsEnum.SUMMARY_TABLE,
  },
  { label: 'Отправления', path: ROUTER_PATHS.DEPARTURES, permission: PermissionsEnum.DEPARTURES },
  {
    label: 'Отчеты по зарплате ',
    path: ROUTER_PATHS.SALARY_REPORTS,
    permission: PermissionsEnum.SALARY_REPORTS,
  },

  { label: 'Доходы - расходы', path: ROUTER_PATHS.FINANCES, permission: PermissionsEnum.FINANCES },
  { label: 'Мои продажи', path: ROUTER_PATHS.MY_SALES, permission: PermissionsEnum.MY_SALES },
  {
    label: 'Общие продажи',
    path: ROUTER_PATHS.COMMON_SALES,
    permission: PermissionsEnum.COMMON_SALES,
  },
  {
    label: 'Список продаж',
    path: ROUTER_PATHS.SALES_LIST,
    permission: PermissionsEnum.SALES_LIST,
  },
  { label: 'Поставщики', path: ROUTER_PATHS.SUPPLIERS, permission: PermissionsEnum.SUPPLIERS },
  { label: 'Закупки', path: ROUTER_PATHS.PROCUREMENTS, permission: PermissionsEnum.PROCUREMENTS },
]

export const HomePage = () => {
  const context = useOutletContext<AuthContext>()

  const { permissions } = context
  const { data } = useMeQuery()
  const roleName = data?.roleName || ''
  const isDirector = roleName === 'Директор'

  const [modalIsOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<{ text: string; type: 'answer' | 'question' }[]>([])
  const [askNlp, { isLoading }] = useAskNlpMutation()
  const [closeDialogue] = useCloseDialogueMutation()

  useEffect(() => {
    // Очищаем dialogueId при первом рендере
    localStorage.removeItem('dialogueId')
  }, [])

  const openModal = () => setIsOpen(true)
  const closeModal = async () => {
    const dialogueId = Number(localStorage.getItem('dialogueId')) || null

    if (dialogueId) {
      await closeDialogue({ dialogueId })
    }
    setIsOpen(false)
    setQuestion('')
    setMessages([])
    localStorage.removeItem('dialogueId')
  }

  const handleAskQuestion = async () => {
    const dialogueId = Number(localStorage.getItem('dialogueId')) || null
    const result = await askNlp({ dialogueId, message: question }).unwrap()

    if (result.dialogueId) {
      localStorage.setItem('dialogueId', result.dialogueId.toString())
    }

    setMessages(prev => [
      ...prev,
      { text: question, type: 'question' },
      { text: result.reply, type: 'answer' },
    ])
    setQuestion('')
  }

  return (
    <div className={'h-screen flex flex-col items-center justify-center'} translate={'no'}>
      <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'}>
        {permissionLinks.map(
          link =>
            permissions[link.permission] && (
              <Link
                className={
                  'p-4 lg:p-6 border rounded-lg hover:bg-gray-100 transition transform lg:translate-y-[-10%] lg:translate-x-[-10%]'
                }
                key={link.permission}
                to={link.path}
              >
                <Typography
                  className={'lg:text-[26px] text-[18px] decoration-skip-ink-none'}
                  variant={'link1'}
                >
                  {link.label}
                </Typography>
              </Link>
            )
        )}
        {isDirector && (
          <Link
            className={
              'p-4 lg:p-6 border rounded-lg hover:bg-gray-100 transition transform lg:translate-y-[-10%] lg:translate-x-[-10%]'
            }
            to={ROUTER_PATHS.SIGN_UP}
          >
            <Typography className={'lg:text-lg'} variant={'link2'}>
              Регистрация нового пользователя
            </Typography>
          </Link>
        )}
      </div>
      <div className={'mt-8'}>
        <button className={'bg-blue-500 text-white py-2 px-4 rounded-lg'} onClick={openModal}>
          Задать вопрос
        </button>
      </div>
      <Modal isOpen={modalIsOpen} onClose={closeModal}>
        <div className={'flex flex-col space-y-4'}>
          <h2 className={'text-xl font-bold'}>Задать вопрос</h2>
          <div className={'flex flex-col space-y-2 overflow-y-auto max-h-64'}>
            {messages.map((msg, index) => (
              <div
                className={`flex ${msg.type === 'question' ? 'justify-start' : 'justify-end'}`}
                key={index}
              >
                <div
                  className={`p-2 m-2 rounded-lg ${msg.type === 'question' ? 'bg-gray-200' : 'bg-blue-200'}`}
                >
                  <Typography>{msg.text}</Typography>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={'flex justify-center'}>
                <Typography>Система размышляет...</Typography>
              </div>
            )}
          </div>
          <div className={'flex'}>
            <input
              className={'flex-1 p-2 border rounded-lg'}
              disabled={isLoading} // Блокируем ввод, пока идет запрос
              onChange={e => setQuestion(e.target.value)}
              placeholder={'Введите ваш вопрос'}
              type={'text'}
              value={question}
            />
            <button
              className={'ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg'}
              disabled={isLoading} // Блокируем кнопку, пока идет запрос
              onClick={handleAskQuestion}
            >
              Отправить
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
