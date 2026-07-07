export class InMemoryLedger {
    history = [];
    append(entry) {
        this.history.push(Object.freeze(entry));
    }
    entries() {
        return this.history;
    }
}
//# sourceMappingURL=append.js.map