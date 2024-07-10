import { Button } from '@/shared/ui-shad-cn/ui/button'
import { useToast } from '@/shared/ui-shad-cn/ui/use-toast'
import { DotsVerticalIcon } from '@radix-ui/react-icons'

export const SignOutButton = () => {
  const { toast } = useToast()

  const handleSignOut = () => {
    try {
      localStorage.removeItem('token')
      console.log('Token removed from localStorage')
      window.location.reload()
    } catch (error) {
      console.error('Sign Out Error:', error)
      toast({
        description: JSON.stringify(error),
        title: 'Sign Out Error',
        variant: 'destructive',
      })
    }
  }

  return (
    <Button className={'h-9 w-9'} onClick={handleSignOut} size={'icon'} variant={'ghost'}>
      <DotsVerticalIcon className={'h-5 w-5'} />
    </Button>
  )
}
