// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ToolbarButton } from '@jupyterlab/apputils';

import { Panel } from '@lumino/widgets';

import { IDebugger } from '../tokens';

import { BreakpointsBody } from './body';

import { BreakpointsHeader } from './header';

import { closeAllIcon } from '../icons';

import { BreakpointsModel } from './model';

/**
 * A Panel to show a list of breakpoints.
 */
export class Breakpoints extends Panel {
  /**
   * Instantiate a new Breakpoints Panel.
   * @param options The instantiation options for a Breakpoints Panel.
   */
  constructor(options: Breakpoints.IOptions) {
    super();
    const { model, service } = options;

    const header = new BreakpointsHeader();
    const body = new BreakpointsBody(model);

    header.toolbar.addItem(
      'closeAll',
      new ToolbarButton({
        icon: closeAllIcon,
        onClick: () => {
          void service.clearBreakpoints();
        },
        tooltip: 'Remove All Breakpoints'
      })
    );

    this.addWidget(header);
    this.addWidget(body);

    this.addClass('jp-DebuggerBreakpoints');
  }
}

/**
 * A namespace for Breakpoints `statics`.
 */
export namespace Breakpoints {
  /**
   * Instantiation options for `Breakpoints`.
   */
  export interface IOptions extends Panel.IOptions {
    /**
     * The breakpoints model.
     */
    model: BreakpointsModel;

    /**
     * The debugger service.
     */
    service: IDebugger;
  }
}
