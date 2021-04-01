declare module '*.svg'

declare module '*.css' {
  const classes: {[key: string]: string}
  export default classes
}
