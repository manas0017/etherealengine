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

import { AssetType, assetPath } from '@etherealengine/common/src/schemas/assets/asset.schema'
import { projectPath } from '@etherealengine/common/src/schemas/projects/project.schema'
import { LocationType, locationPath } from '@etherealengine/common/src/schemas/social/location.schema'
import { getDateTimeSql } from '@etherealengine/common/src/utils/datetime-sql'
import type { Knex } from 'knex'
import { v4 } from 'uuid'

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex: Knex): Promise<void> {
  const trx = await knex.transaction()
  await trx.raw('SET FOREIGN_KEY_CHECKS=0')

  const sceneTableExists = await trx.schema.hasTable(assetPath)

  if (sceneTableExists === false) {
    await trx.schema.createTable(assetPath, (table) => {
      //@ts-ignore
      table.uuid('id').collate('utf8mb4_bin').primary()
      table.string('assetURL', 255).notNullable().unique()
      //@ts-ignore
      table.uuid('projectId').collate('utf8mb4_bin')
      table.foreign('projectId').references('id').inTable(projectPath).onDelete('CASCADE').onUpdate('CASCADE')
      table.string('thumbnailURL', 255)
      table.dateTime('createdAt').notNullable()
      table.dateTime('updatedAt').notNullable()
    })

    const locations = await trx.select().from(locationPath)
    if (locations.length > 0) {
      const locationSceneIds = await Promise.all(
        locations
          .filter((item) => item.sceneId)
          .map(async (location: LocationType) => {
            const id = v4()
            await trx.from(locationPath).where({ sceneId: location.sceneId }).update({ sceneId: id })
            const [, projectName] = location.sceneId.split('/')
            const projects = await trx.select().from(projectPath).where('name', projectName)
            if (!projects.length) return
            const projectId = projects[0].id
            return {
              id,
              assetURL: location.sceneId,
              thumbnailURL: location.sceneId.replace('.scene.json', '.thumbnail.jpg'),
              projectId,
              createdAt: await getDateTimeSql(),
              updatedAt: await getDateTimeSql()
            } as AssetType
          })
          .filter(Boolean)
      )

      await trx.from(assetPath).insert(locationSceneIds)
    }
  }

  /** Change location table from storing sceneId as string to ref the scenetable */
  await trx.schema.alterTable(locationPath, (table) => {
    //@ts-ignore
    table.uuid('sceneId').collate('utf8mb4_bin').alter()
    table.foreign('sceneId').references('id').inTable(assetPath).onDelete('CASCADE').onUpdate('CASCADE')
  })

  await trx.raw('SET FOREIGN_KEY_CHECKS=1')
  await trx.commit()
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex: Knex): Promise<void> {
  const trx = await knex.transaction()
  await trx.raw('SET FOREIGN_KEY_CHECKS=0')

  const tableExists = await trx.schema.hasTable(assetPath)

  if (tableExists === true) {
    await trx.schema.dropTable(assetPath)
  }

  await trx.raw('SET FOREIGN_KEY_CHECKS=1')
  await trx.commit()
}
