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

import { Frustum, Matrix4, Vector3 } from 'three'

import { getMutableState } from '@etherealengine/hyperflux'

import { Engine, getComponent } from '@etherealengine/ecs'
import { Entity } from '@etherealengine/ecs/src/Entity'
import { TransformComponent } from '@etherealengine/spatial'
import { CameraComponent } from '@etherealengine/spatial/src/camera/components/CameraComponent'
import {
  DistanceFromLocalClientComponent,
  compareDistanceToLocalClient
} from '@etherealengine/spatial/src/transform/components/DistanceComponents'
import { InteractableComponent } from '../components/InteractableComponent'
import { InteractableState } from '../systems/InteractableSystem'

const worldPosVec3 = new Vector3()
const mat4 = new Matrix4()
const frustum = new Frustum()

/**
 * Checks if entity is in range based on its own threshold
 * @param entity
 * @constructor
 */
const inRangeAndFrustumToInteract = (entity: Entity): boolean => {
  const interactable = getComponent(entity, InteractableComponent)
  const maxDistanceSquare = interactable.activationDistance * interactable.activationDistance
  let inRangeAndFrustum = DistanceFromLocalClientComponent.squaredDistance[entity] < maxDistanceSquare
  if (inRangeAndFrustum) {
    inRangeAndFrustum = inFrustum(entity)
  }
  return inRangeAndFrustum
}

export const inFrustum = (entity: Entity): boolean => {
  TransformComponent.getWorldPosition(entity, worldPosVec3)
  return frustum.containsPoint(worldPosVec3)
}

/**
 * Checks if entity can interact with any of entities listed in 'interactable' array, checking distance, guards and raycast
 * sorts the interactables by closest to the player
 * @param {Entity[]} interactables
 */
export const gatherAvailableInteractables = (interactables: Entity[]) => {
  const availableInteractable = getMutableState(InteractableState).available

  const camera = getComponent(Engine.instance.viewerEntity, CameraComponent)

  mat4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
  frustum.setFromProjectionMatrix(mat4)

  availableInteractable.set(
    [...interactables].filter((entity) => inRangeAndFrustumToInteract(entity)).sort(compareDistanceToLocalClient)
  )
}