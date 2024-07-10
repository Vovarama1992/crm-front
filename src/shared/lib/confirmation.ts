import { createStrictContext, useStrictContext } from './strict-context'

export type ConfirmationParams = {
  cancelButtonText?: string
  confirmButtonText?: string
  description?: string
  title?: string
}

export type ConfirmationContext = {
  closeConfirmation: () => void
  getConfirmation: (params: ConfirmationParams) => Promise<boolean>
}

export const confirmationContext = createStrictContext<ConfirmationContext>()

export const useGetConfirmation = () => {
  const { closeConfirmation, getConfirmation } = useStrictContext(confirmationContext)

  return { closeConfirmation, getConfirmation }
}
