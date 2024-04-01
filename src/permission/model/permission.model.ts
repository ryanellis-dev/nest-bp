import { Action } from './action.model';
import { ResourceType } from './resources.model';

export class Permission {
  action: Action;
  type: ResourceType;

  constructor(action: Action, type: ResourceType) {
    this.action = action;
    this.type = type;
  }

  toString() {
    return `${this.action}:${this.type}`;
  }
}

export function allActionsToString(resourceType: ResourceType) {
  return `${Action.All}:${resourceType}`;
}
