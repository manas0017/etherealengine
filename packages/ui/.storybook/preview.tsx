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

import { Description, Primary, Stories, Subtitle, Title } from '@storybook/addon-docs'
import { Preview } from '@storybook/react'
import React, { lazy } from 'react'
import { withRouter } from 'storybook-addon-react-router-v6'

import { ThemeProvider } from '@etherealengine/client-core/src/common/services/ThemeService'
import '../../client/src/themes/base.css'
import '../../client/src/themes/components.css'
import '../../client/src/themes/utilities.css'
const Engine = lazy(() => import('@etherealengine/client/src/engine'))

export const decorators = [
  withRouter,
  (Story) => {
    return (
      <Engine>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </Engine>
    )
  }
]

const preview: Preview = {
  globalTypes: {
    eeEnabled: {
      description: 'Ethereal Engine',
      defaultValue: false
    }
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    },
    options: {
      storySort: {
        order: ['Pages', 'Admin', 'Components', 'Primitives', 'Addons', 'Expermiental']
      }
    },
    docs: {
      source: {
        type: 'code'
      },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Stories />
        </>
      )
    },
    actions: { argTypesRegex: '^on[A-Z].*' }
  }
}

export default preview
