// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { CommandRegistry } from '@lumino/commands';

import { IDebugger } from '../tokens';

import { Panel, Widget } from '@lumino/widgets';

import { VariablesBodyTable } from './table';

import { VariablesHeader } from './header';

import { ToolbarButton } from '@jupyterlab/apputils';

import { VariablesModel } from './model';

import { VariablesBodyTree } from './tree';

/**
 * A Panel to show a variable explorer.
 */
export class Variables extends Panel {
  /**
   * Instantiate a new Variables Panel.
   * @param options The instantiation options for a Variables Panel.
   */
  constructor(options: Variables.IOptions) {
    super();

    const { model, service, commands } = options;

    this._header = new VariablesHeader();
    this._tree = new VariablesBodyTree({ model, service });
    this._table = new VariablesBodyTable({ model, commands });
    this._table.hide();

    const onClick = () => {
      if (this._table.isHidden) {
        this._tree.hide();
        this._table.show();
        this.node.setAttribute('data-jp-table', 'true');
      } else {
        this._tree.show();
        this._table.hide();
        this.node.removeAttribute('data-jp-table');
      }
      this.update();
    };

    this._header.toolbar.addItem(
      'view-VariableSwitch',
      new ToolbarButton({
        className: 'jp-SwitchButton',
        iconClass: 'jp-ToggleSwitch',
        onClick,
        tooltip: 'Table / Tree View'
      })
    );

    this.addWidget(this._header);
    this.addWidget(this._tree);
    this.addWidget(this._table);
    this.addClass('jp-DebuggerVariables');
  }

  private _header: VariablesHeader;
  private _tree: Widget;
  private _table: Widget;

  /**
   * A message handler invoked on a `'resize'` message.
   */
  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this._resizeBody(msg);
  }

  /**
   * Resize the body.
   * @param msg The resize message.
   */
  private _resizeBody(msg: Widget.ResizeMessage) {
    const height = msg.height - this._header.node.offsetHeight;
    if (this._table.node?.children.length > 0) {
      (this._table.node.children[0]
        .children[1] as HTMLElement).style.height = `${height}px`;
      this._tree.node.style.height = `${height}px`;
    }
  }
}

/**
 * Convert a variable to a primitive type.
 * @param variable The variable.
 */
export const convertType = (variable: VariablesModel.IVariable) => {
  const { type, value } = variable;
  switch (type) {
    case 'int':
      return parseInt(value, 10);
    case 'float':
      return parseFloat(value);
    case 'bool':
      return value;
    case 'str':
      return value.slice(1, value.length - 1);
    default:
      return type;
  }
};

/**
 * A namespace for Variables `statics`.
 */
export namespace Variables {
  /**
   * Instantiation options for `Variables`.
   */
  export interface IOptions extends Panel.IOptions {
    /**
     * The variables model.
     */
    model: VariablesModel;
    /**
     * The debugger service.
     */
    service: IDebugger;
    /**
     * The commands registry.
     */
    commands: CommandRegistry;
  }
}
