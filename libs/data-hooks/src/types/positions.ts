import { Position } from 'zerion-sdk-ts';

type ZerionPositionAttributes = Position['attributes'];

export interface PositionAttributes extends ZerionPositionAttributes {
  changes?: {
    absolute_1d?: number;
    percent_1d?: number;
  };
}

export interface ZerionPosition extends Position {
  attributes: PositionAttributes;
}
