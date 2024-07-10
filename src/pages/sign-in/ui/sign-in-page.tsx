import { Link } from 'react-router-dom'

import { SignInForm } from '@/features/auth/sign-in'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { Typography } from '@/shared/ui/typography'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui-shad-cn/ui/card'

export const SignInPage = () => {
  return (
    <div>
      <section>
        <Card className={'max-w-[320px] ml-[30%] mt-5'}>
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
