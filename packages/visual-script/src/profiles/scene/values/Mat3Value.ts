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

import { ValueType } from '../../../VisualScriptModule'
import { Mat3, mat3Equals, Mat3JSON, mat3Mix, mat3Parse } from './internal/Mat3'

export const Mat3Value: ValueType = {
  name: 'mat3',
  creator: () => new Mat3(),
  deserialize: (value: string | Mat3JSON) => (typeof value === 'string' ? mat3Parse(value) : new Mat3(value)),
  serialize: (value) => value.elements as Mat3JSON,
  lerp: (start: Mat3, end: Mat3, t: number) => mat3Mix(start, end, t),
  equals: (a: Mat3, b: Mat3) => mat3Equals(a, b),
  clone: (value: Mat3) => value.clone()
}