// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Panel, SplitPanel, Widget } from '@lumino/widgets';

import { caretDownIcon, caretLeftIcon } from '@jupyterlab/ui-components';

/**
 * The Caret Button for collapse in SplitPanel.
 */
export class CaretWidget extends Widget {
  openedHeight: string;
  /**
   * Instantiate a new CaretWidget.
   * @param indexWidget index of added widget in splitPanel
   */
  constructor() {
    super();

    const style = {
      className: 'jp-CaretButton',
      height: 'auto',
      width: '20px'
    };
    this.node.style.minWidth = '25px';

    this.caretLeft = caretLeftIcon.element(style);
    this.caretDown = caretDownIcon.element(style);
    this._onClick = this._onClick.bind(this);
    this.caretDown.onclick = this._onClick;
    this.node.append(this.caretDown);
    this.caretLeft.onclick = this._onClick;
  }

  private _onClick() {
    const splitPanel = (this.parent.parent.parent.parent as Panel)
      .widgets[1] as SplitPanel;
    const widget = this.parent.parent;
    const relativeSizes = splitPanel.relativeSizes();
    const hideClassHandler = ['lm-mod-hidden', 'p-mod-hidden'];
    const collapsedClass = 'collapsed';
    const isAllCollapsed =
      splitPanel.widgets.filter(
        (panels: Panel) => !panels.hasClass(collapsedClass)
      ).length === 1;

    const setRelativeSizes = () => {
      splitPanel.widgets.forEach((panel: Panel, index) => {
        const collapsed = panel.hasClass(collapsedClass);
        relativeSizes[index] = collapsed ? 0.008 : 0.1;
        if (collapsed) {
          panel.widgets[1].hide();
          splitPanel.handles[index].classList.add(...hideClassHandler);
        } else {
          splitPanel.handles[index].classList.remove(...hideClassHandler);
          panel.widgets[1].show();
        }
      });
      splitPanel.setRelativeSizes(relativeSizes);
    };

    if (this.isOpen) {
      if (isAllCollapsed) {
        return;
      }
      widget.toggleClass(collapsedClass);
      setRelativeSizes();
      this.node.removeChild(this.caretDown);
      this.node.append(this.caretLeft);
    } else {
      widget.toggleClass(collapsedClass);
      setRelativeSizes();
      this.node.removeChild(this.caretLeft);
      this.node.append(this.caretDown);
    }
    this.isOpen = !this.isOpen;
  }

  private caretLeft: HTMLElement;
  private caretDown: HTMLElement;
  private isOpen: boolean = true;
}
