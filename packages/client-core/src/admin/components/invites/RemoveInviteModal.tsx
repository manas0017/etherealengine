/*
CPAL-1.0 License

The contents of this file are subject to the Common Public Attribution License
Version 1.0. (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at
https://github.com/EtherealEngine/etherealengine/blob/dev/LICENSE.
The License is based on the Mozilla Public License Version 1.1, but Sections 14
and 15 have been added to cover use of software over a computer network and 
provide for limited attribution for the Original Developer. In addition, 
Exhibit A has been modified to be consistent with Exhibit B.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
specific language governing rights and limitations under the License.

The Original Code is Ethereal Engine.

The Original Developer is the Initial Developer. The Initial Developer of the
Original Code is the Ethereal Engine team.

All portions of the code written by the Ethereal Engine team are Copyright © 2021-2023 
Ethereal Engine. All Rights Reserved.
*/

import { PopoverState } from '@etherealengine/client-core/src/common/services/PopoverState'
import { InviteType, UserName, invitePath } from '@etherealengine/common/src/schema.type.module'
import { useHookstate } from '@etherealengine/hyperflux'
import { useMutation } from '@etherealengine/spatial/src/common/functions/FeathersHooks'
import Modal from '@etherealengine/ui/src/primitives/tailwind/Modal'
import Text from '@etherealengine/ui/src/primitives/tailwind/Text'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function RemoveInviteModal({ invites }: { invites: InviteType[] }) {
  const { t } = useTranslation()
  const adminInviteRemove = useMutation(invitePath).remove
  const modalProcessing = useHookstate(false)
  const error = useHookstate('')

  const handleSubmit = async () => {
    modalProcessing.set(true)
    error.set('')
    try {
      await Promise.all(
        invites.map((invite) => {
          adminInviteRemove(invite.id)
        })
      )
      PopoverState.hidePopupover()
    } catch (err) {
      error.set(err.message)
    }
    modalProcessing.set(false)
  }

  return (
    <Modal
      title={invites.length === 1 ? t('admin:components.invite.remove') : t('admin:components.invite.removeInvites')}
      onSubmit={handleSubmit}
      onClose={PopoverState.hidePopupover}
      submitLoading={modalProcessing.value}
    >
      {error.value && <p className="mb-3 text-red-700">{error.value}</p>}
      <Text>
        {invites.length === 1
          ? `${t('admin:components.invite.confirmInviteDelete')} '${
              invites[0].invitee?.name || ((invites[0].token || '') as UserName)
            }'?`
          : t('admin:components.invite.confirmMultiInviteDelete')}
      </Text>
    </Modal>
  )
}
