/*~ Write your module's methods and properties in this class */
declare class Beforeunload {
  block(options?: Beforeunload.BlockOptions): void;
  unblock(): void;
}

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block.
 *~
 *~ Note that if you decide to include this namespace, the module can be
 *~ incorrectly imported as a namespace object, unless
 *~ --esModuleInterop is turned on:
 *~   import * as x from '[~THE MODULE~]'; // WRONG! DO NOT DO THIS!
 */
declare namespace Beforeunload {
  export interface BlockOptions {
    dialogText?: string;
  }
}

const Instance = new Beforeunload();

export default Instance;
