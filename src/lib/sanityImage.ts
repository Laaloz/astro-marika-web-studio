import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'
import {sanityClient} from 'sanity:client'

const {projectId, dataset} = sanityClient.config()

const builder =
  projectId && dataset ? createImageUrlBuilder({projectId, dataset}) : null

export function urlFor(source: SanityImageSource) {
  return builder?.image(source).auto('format')
}

export type SanityImageFit = 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
