export function getInstance(className: any, id = 0) {
    return className.mock.instances[id];
}
