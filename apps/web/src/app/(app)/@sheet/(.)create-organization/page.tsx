import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import OrganizationForm from '../../org/organization-form'

export default function CreateOrganization() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>New Organization</SheetTitle>
        </SheetHeader>
        <div className="px-4 py-4">
          <OrganizationForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}
