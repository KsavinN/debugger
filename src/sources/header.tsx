// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ReactWidget, Toolbar, UseSignal } from '@jupyterlab/apputils';

import { PanelLayout, Widget } from '@lumino/widgets';

import { CaretWidget } from '../caretWidget';

import { SourcesModel } from './model';

import React from 'react';

/**
 * The header for a Source Panel.
 */
export class SourcesHeader extends Widget {
  /**
   * Instantiate a new SourcesHeader.
   * @param model The model for the Sources.
   */
  constructor(model: SourcesModel) {
    super({ node: document.createElement('header') });

    const layout = new PanelLayout();
    this.layout = layout;

    const title = new Widget({ node: document.createElement('h2') });
    title.node.textContent = 'Source';

    const sourcePath = ReactWidget.create(
      <SourcePathComponent model={model} />
    );

    const carret = new CaretWidget(3);

    layout.addWidget(carret);
    layout.addWidget(title);
    layout.addWidget(this.toolbar);
    layout.addWidget(sourcePath);

    this.addClass('jp-DebuggerSources-header');
  }

  /**
   * The toolbar for the sources header.
   */
  readonly toolbar = new Toolbar();
}

/**
 * A React component to display the path to a source.
 * @param model The model for the sources.
 */
const SourcePathComponent = ({ model }: { model: SourcesModel }) => {
  return (
    <UseSignal signal={model.currentSourceChanged} initialSender={model}>
      {model => (
        <span onClick={() => model.open()}>
          {model.currentSource?.path ?? ''}
        </span>
      )}
    </UseSignal>
  );
};
