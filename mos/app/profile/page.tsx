import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { getLoggedInUser } from '@/utils/getLoggedInUser'
import { Edit } from 'lucide-react'
import Image from 'next/image'

export default async function profile() {
    const {supaUser, dbUser} = await getLoggedInUser()
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='flex justify-center items-center '>
        <div className='flex flex-col gap-4 w-fit bg-secondary rounded-2xl p-15'>
          <div className='flex items-center gap-4 '>
            <Image src={supaUser?.user_metadata.avatar_url} alt="user-profile-image" width={160} height={160} className='rounded-full'/>
            <Button>
              <Edit/>
            </Button>
          </div>
          
          <div className='flex flex-col'>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel>Username:</FieldLabel>
                  <Input id="username" type="text" placeholder="Max Leiter" disabled={true} value={supaUser?.user_metadata.name} />
                </Field>

                <Field>
                  <FieldLabel>Email:</FieldLabel>
                  <Input id="email" type="email" placeholder="max.leiter@example.com" disabled={true} value={supaUser?.user_metadata.email} />
                </Field>

                <Field>
                  <FieldLabel>Role:</FieldLabel>
                  <Input id="role" type="text" placeholder="USER" disabled={true} value={dbUser?.role} />
                </Field>
              </FieldGroup>
            </FieldSet>
          </div>
        </div>
      </div>
    </div>
  )
}
