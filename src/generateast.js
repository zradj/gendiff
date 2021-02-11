import _ from 'lodash';

const generateAst = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2));

  const ast = keys
    .map((key) => {
      const entry = {};
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (!_.has(obj1, key) && _.has(obj2, key)) {
        entry.status = 'added';
        entry.value = value2;
      } else if (_.has(obj1, key) && !_.has(obj2, key)) {
        entry.status = 'deleted';
      } else if (_.isEqual(value1, value2)) {
        entry.status = 'unchanged';
      } else if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
        const children = generateAst(obj1[key], obj2[key]);

        entry.status = 'nested';
        entry.value = children;
      } else if (!_.isEqual(value1, value2)) {
        entry.status = 'edited';
        entry.oldValue = value1;
        entry.value = value2;
      }

      return { key, value: value1, ...entry };
    });

  return _.sortBy(ast, (entry) => entry.key);
};

export default generateAst;