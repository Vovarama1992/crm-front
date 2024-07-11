import { SignInForm } from '@/features/auth/sign-in'
import { Typography } from '@/shared/ui/typography'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui-shad-cn/ui/card'

export const SignInPage = () => {
  return (
    <div>
      <section>
        <Card className={'max-w-[320px] h-[300px] lg:h-[350px]  mt-5'}>
          <CardHeader>
            <Typography
              className={'text-center lg:text-[40px] text-gray-500 text-[40px]'}
              variant={'h1'}
            >
              Вход
            </Typography>
          </CardHeader>
          <CardContent>
            <SignInForm />
          </CardContent>
          <CardFooter className={'flex flex-col justify-center'}></CardFooter>
        </Card>
      </section>
    </div>
  )
}
