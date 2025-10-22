"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_CONSTANTS_A_Command_Features = exports.A_CONSTANTS__A_Command_Status = exports.A_TYPES__CommandMetaKey = void 0;
var A_TYPES__CommandMetaKey;
(function (A_TYPES__CommandMetaKey) {
    A_TYPES__CommandMetaKey["EXTENSIONS"] = "a-command-extensions";
    A_TYPES__CommandMetaKey["FEATURES"] = "a-command-features";
    A_TYPES__CommandMetaKey["ABSTRACTIONS"] = "a-command-abstractions";
})(A_TYPES__CommandMetaKey || (exports.A_TYPES__CommandMetaKey = A_TYPES__CommandMetaKey = {}));
var A_CONSTANTS__A_Command_Status;
(function (A_CONSTANTS__A_Command_Status) {
    A_CONSTANTS__A_Command_Status["INITIALIZED"] = "INITIALIZED";
    A_CONSTANTS__A_Command_Status["IN_PROGRESS"] = "IN_PROGRESS";
    A_CONSTANTS__A_Command_Status["COMPLETED"] = "COMPLETED";
    A_CONSTANTS__A_Command_Status["FAILED"] = "FAILED";
})(A_CONSTANTS__A_Command_Status || (exports.A_CONSTANTS__A_Command_Status = A_CONSTANTS__A_Command_Status = {}));
/**
 * A-Command Lifecycle Features
 */
var A_CONSTANTS_A_Command_Features;
(function (A_CONSTANTS_A_Command_Features) {
    A_CONSTANTS_A_Command_Features["INIT"] = "init";
    A_CONSTANTS_A_Command_Features["COMPLIED"] = "complied";
    A_CONSTANTS_A_Command_Features["EXECUTE"] = "execute";
    A_CONSTANTS_A_Command_Features["COMPLETE"] = "complete";
    A_CONSTANTS_A_Command_Features["FAIL"] = "fail";
})(A_CONSTANTS_A_Command_Features || (exports.A_CONSTANTS_A_Command_Features = A_CONSTANTS_A_Command_Features = {}));
//# sourceMappingURL=A-Command.constants.js.map