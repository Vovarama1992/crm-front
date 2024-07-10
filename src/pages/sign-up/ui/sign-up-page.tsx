import { SignUpForm } from '@/features/auth/sign-up'
import { Typography } from '@/shared/ui/typography'
import { Card, CardContent, CardHeader } from '@/shared/ui-shad-cn/ui/card'

export const SignUpPage = () => {
  return (
    <div>
      <section>
        <Card className={'w-[320px] lg:w-[380px] lg:h-[auto] m-auto mt-5'}>
          <CardHeader>
            <Typography
              className={'text-center lg:text-[40px] text-gray-500 text-[40px]'}
              variant={'h1'}
            >
              Регистрация
            </Typography>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
