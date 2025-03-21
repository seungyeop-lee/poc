import type { double, Feature2D, int } from './_types'

/**
 *    int	nOctaveLayers,
 * double	contrastThreshold,
 * double	edgeThreshold,
 * double	sigma,
 * int	descriptorType,
 * bool	enable_precise_upscale = false
 */
/**
 * https://docs.opencv.org/4.11.0/d7/d60/classcv_1_1SIFT.html
 */
export declare class SIFT extends Feature2D {
  public constructor(
    nfeatures?: int,
    nOctaveLayers?: int,
    contrastThreshold?: double,
    edgeThreshold?: double,
    sigma?: double,
    descriptorType?: int,
    enable_precise_upscale?: boolean = false
  );
}
