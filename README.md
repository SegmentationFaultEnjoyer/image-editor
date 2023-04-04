
[![npm](https://img.shields.io/npm/v/simple-fabric-vue-image-editor)](https://www.npmjs.com/package/simple-fabric-vue-image-editor)
[![ts](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)](https://www.typescriptlang.org/)
[![vue](https://img.shields.io/badge/-Vue.js-4fc08d?style=flat&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![fabric](https://img.shields.io/npm/v/fabric?label=fabric.js)](https://www.npmjs.com/package/fabric)

# Image Editor

A brief description of what the library is and what it does.
Here will be description of all editor modules

## Installation

To install the library, run the following command:

```
npm install simple-fabric-vue-image-editor

# or

yarn add simple-fabric-vue-image-editor
```


## Usage

To use the library in your project - import the desired components or composables.
You can use image editor out of box by using vue component or import vue composable

<b>Direct usage example</b>:

```vue
<template>
    <image-editor :image-url="linkToYourImage"/>
</template>

<script setup lang=ts> 
import { ImageEditor } from 'simple-fabric-vue-image-editor'
</script>
````

also you need to import styles if you want to use Vue components
```javascript
import 'simple-fabric-vue-image-editor/dist/fabric-vue-image-editor-ts.css'
```

<b>Creating own editor example</b>:

```vue
<template>
    <div class='your-image-editor'>
        <div ref="editorContainerRef">
            <canvas ref="editorCanvasRef" />
        </div>
        <your-own-component-for-tools v-if="isEditorInitialized" />
    </div>
<template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'
import { 
    useImageEditor,
    EditorInstanceKey
} from 'simple-fabric-vue-image-editor'

const editorContainerRef = ref<HTMLElement | null>(null)
const editorCanvasRef = ref<HTMLCanvasElement | null>(null)

const isEditorInitialized = ref(false)

/* to avoid visual bugs with canvas - invoking composable only when
    editor container ref initialized
*/
onMounted(async () => {
  if (!editorCanvasRef.value || !editorContainerRef.value) return

  const editorInstance = useImageEditor(editorCanvasRef, editorContainerRef)

  try {
    await editorInstance.init(/* yourImageURL */)
    // providing canvas instance to all nested layers 
    provide(EditorInstanceKey, { instance: editorInstance })
    isEditorInitialized.value = true
    /* 
        After editorInstance is provided you can access it
        in descendant components using vue inject

        example:
        import { inject } from 'vue'
        import { EditorInstanceKey } from 'simple-fabric-vue-image-editor'
        
        const { instance } = inject(EditorInstanceKey)
  */

  } catch (error) {
    /* your error handling */
  }
})
</script>
```



## Manual building

To manually build the library:
- clone git repo
- install all depenecies  
    ```yarn install```
    
     or
    
     ```npm i```
- ```yarn build```
- ```npm run publish-package``` to push to nmpjs registry
