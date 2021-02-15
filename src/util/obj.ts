// deletes keys when set to literal 'undefined'
export default function shallowMerge(...objects: any[]): any {
  const newObj: any = {};
  objects.forEach((o) => {
    Object.keys(o).forEach((key: string) => {
      if (o[key] === undefined) {
        delete newObj[key];
      } else {
        newObj[key] = o[key];
      }
    });
  });
  return newObj;
}
