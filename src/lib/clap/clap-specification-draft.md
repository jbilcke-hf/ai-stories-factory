# CLAP Format Specification

- Status: DRAFT
- Document revision: 0.0.1
- Last updated: Feb 6th, 2024
- Author(s): Julian BILCKE (@flngr)

## BEFORE YOU READ

The CLAP format spec is experimental and not finished yet!
There might be inconsistencies, unnecessary redundancies or blatant omissions.

## What are CLAP files?

The CLAP format (.clap) is a file format designed for AI video projects.

It preserves prompts and assets into the same container, making it easier to share an AI video project between different people or applications.

## Structure

A CLAP is an array of objects serialized into a YAML text string, then finally compressed using gzip to a binary file.

The file extension is `.clap`
The mime type is `application/x-yaml`

There can be 5 different types of objects:

- one HEADER
- one METADATA
- zero, one or more MODEL(s)
- zero, one or more SCENE(s)
- zero, one or more SEGMENT(s)

This can be represented in javascript like this:

```javascript
[
  clapHeader, // one metadata object
  clapMeta, // one metadata object
  ...clapModels, // optional array of models
  ...clapScenes, // optional array of scenes
  ...clapSegments // optional array of segments
]
```

## Header

The HEADER provides information about how to decode a CLAP.

Knowing in advance the number of models, scenes and segments helps the decoder parsing the information,
and in some implementation, help with debugging, logging, and provisioning memory usage.

However in the future, it is possible that a different scheme is used, in order to support streaming.

Either by recognizing the shape of each object (fields), or by using a specific field eg. a `_type`.

```typescript
{
  // used to know which format version is used.
  // CLAP is still in development and the format is not fully specified yet,
  // during the period most .clap file will have the "clap-0" format
  format: "clap-0"
  
  numberOfModels: number // integer
  numberOfScenes: number // integer
  numberOfSegments: number // integer
}
```

## Metadata

```typescript
{
  id: string // "<a valid UUID V4>"
  title: string // "project title"
  description: string // "project description"
  licence: string // "information about licensing"

  // this provides information about the image ratio
  // this might be removed in the final spec, as this
  // can be re-computed from width and height
  orientation: "landscape" | "vertical" | "square"

  // the expected duration of the project
  durationInMs: number

  // the suggested width and height of the video
  // note that this is just an indicator,
  // and might be superseeded by the application reading the .clap file
  width: number // integer between 256 and 8192 (value in pixels)
  height: number // integer between 256 and 8192 (value in pixels)

  // name of the suggested video model to use
  // note that this is just an indicator,
  // and might be superseeded by the application reading the .clap file
  defaultVideoModel: string

  // additional prompt to use in the video generation
  // this helps adding some magic touch and flair to the videos,
  // but perhaps the field should be renamed
  extraPositivePrompt: string

  // the screenplay (script) of the video
  screenplay: string

  // whether to loop the content by default or not
  isLoop: boolean
  
  // helper to indicate whether the .clap might contain interactive elements
  isInteractive: boolean
}
```

## Models

Before talking about models, first we should describe the concept of entity:

in a story, an entity is something (person, place, vehicle, animal, robot, alien, object) with a name, a description of the appearance, an age, mileage or quality, an origin, and so on.

An example could be "a giant magical school bus, with appearance of a cat with wheels, and which talks"

The CLAP model would be an instance (an interpretation) of this entity, where we would assign it an identity:
- a name and age
- a visual style (a photo of the magic school bus cat)
- a voice style
- and maybe other things eg. an origin or background story

As you can see, it can be difficult to create clearly separated categories, like "vehicule", "character", or "location"
(the magical cat bus could turn into a location in some scene, a speaking character in another etc)

This is why there is a common schema for all models:

```typescript
{
  id: string
  category: ClapSegmentCategory
  triggerName: string
  label: string
  description: string
  author: string
  thumbnailUrl: string
  seed: number

  assetSourceType: ClapAssetSource
  assetUrl: string
  
  age: number
  gender: ClapModelGender
  region: ClapModelRegion
  appearance: ClapModelAppearance
  voiceVendor: ClapVoiceVendor
  voiceId: string
}
```

## Atomic types

...

## TO BE CONTINUED

(you can read "./types.ts" for more information)