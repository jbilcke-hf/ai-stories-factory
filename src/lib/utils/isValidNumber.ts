export function isValidNumber(input: any) {
  return (
    typeof (input) === "number" && 
    isFinite(input) &&
    !isNaN(input)
  )
}