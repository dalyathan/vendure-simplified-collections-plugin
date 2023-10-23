export default function normalizeId(testId: string){
    const splitted= testId.split('_')
    return splitted[splitted.length-1]
}