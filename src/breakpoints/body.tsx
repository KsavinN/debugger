// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { ReactWidget } from '@jupyterlab/apputils';

import React, { useEffect, useState } from 'react';

import { IDebugger } from '../tokens';

import { BreakpointsModel } from './model';

/**
 * The body for a Breakpoints Panel.
 */
export class BreakpointsBody extends ReactWidget {
  /**
   * Instantiate a new Body for the Breakpoints Panel.
   * @param model The model for the breakpoints.
   */
  constructor(model: BreakpointsModel) {
    super();
    this._model = model;
    this.addClass('jp-DebuggerBreakpoints-body');
  }

  /**
   * Render the BreakpointsComponent.
   */
  render() {
    return <BreakpointsComponent model={this._model} />;
  }

  private _model: BreakpointsModel;
}

/**
 * A React component to display a list of breakpoints.
 * @param model The model for the breakpoints.
 */
const BreakpointsComponent = ({ model }: { model: BreakpointsModel }) => {
  const [breakpoints, setBreakpoints] = useState(
    Array.from(model.breakpoints.entries())
  );

  useEffect(() => {
    const updateBreakpoints = (
      _: BreakpointsModel,
      updates: IDebugger.IBreakpoint[]
    ) => {
      setBreakpoints(Array.from(model.breakpoints.entries()));
    };

    const restoreBreakpoints = (_: BreakpointsModel) => {
      setBreakpoints(Array.from(model.breakpoints.entries()));
    };

    model.changed.connect(updateBreakpoints);
    model.restored.connect(restoreBreakpoints);

    return () => {
      model.changed.disconnect(updateBreakpoints);
      model.restored.disconnect(restoreBreakpoints);
    };
  });

  return (
    <>
      {breakpoints.map(entry => (
        <BreakpointCellComponent
          key={entry[0]}
          breakpoints={entry[1]}
          model={model}
        />
      ))}
    </>
  );
};

/**
 * A React Component to display breakpoints grouped by source file.
 * @param breakpoints The list of breakpoints.
 * @param model The model for the breakpoints.
 */
const BreakpointCellComponent = ({
  breakpoints,
  model
}: {
  breakpoints: IDebugger.IBreakpoint[];
  model: BreakpointsModel;
}) => {
  return (
    <>
      {breakpoints
        .sort((a, b) => {
          return a.line - b.line;
        })
        .map((breakpoint: IDebugger.IBreakpoint, index) => (
          <BreakpointComponent
            key={breakpoint.source.path + index}
            breakpoint={breakpoint}
            model={model}
          />
        ))}
    </>
  );
};

/**
 * A React Component to display a single breakpoint.
 * @param breakpoints The breakpoint.
 * @param model The model for the breakpoints.
 */
const BreakpointComponent = ({
  breakpoint,
  model
}: {
  breakpoint: IDebugger.IBreakpoint;
  model: BreakpointsModel;
}) => {
  return (
    <div
      className={`jp-DebuggerBreakpoint`}
      onClick={() => model.clicked.emit(breakpoint)}
      title={breakpoint.source.path}
    >
      <span className={'jp-DebuggerBreakpoint-marker'}>●</span>
      <span className={'jp-DebuggerBreakpoint-source'}>
        {breakpoint.source.path}
      </span>
      <span className={'jp-DebuggerBreakpoint-line'}>{breakpoint.line}</span>
    </div>
  );
};
