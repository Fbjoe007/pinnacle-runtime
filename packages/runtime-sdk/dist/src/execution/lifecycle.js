const allowedTransitions = {
    CREATED: ["RUNNING", "CANCELLED"],
    RUNNING: ["SUCCEEDED", "FAILED", "CANCELLED"],
    SUCCEEDED: [],
    FAILED: [],
    CANCELLED: []
};
export function canTransition(from, to) {
    return allowedTransitions[from].includes(to);
}
//# sourceMappingURL=lifecycle.js.map