# Image Editor

A brief description of what the library is and what it does.

## Installation

To install the library, run the following command:

```
npm install simple-fabric-vue-image-editor

# or

yarn add simple-fabric-vue-image-editor
```


## Usage

To use the library in your project, import the desired components or composables For example:

```javascript
import { SomeComponent, someComposable } from 'simple-fabric-vue-image-editor';
```
also you need to import styles if you want to use Vue components
```javascript
import 'simple-fabric-vue-image-editor/dist/fabric-vue-image-editor-ts.css'
```
if you want to make icons work properly. Add this only if you don't have this import already in your project
```javascript
import 'virtual:svg-icons-register'
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