export default
[
    {
        name:'function-value-return-enabled',
        type:'boolean'
    },
    {
        name:'function-value-return-keyword',
        type:'keyword'
    },
    {
        name:'imports-keyword',
        type:'keyword'
    }
] as Rule[];
type RuleType = 'keyword'|'boolean';

interface Rule {
    name: string;
    type: RuleType
}