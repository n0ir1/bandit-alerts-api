import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export interface Upash {
  hash(password: string, options?: HashOptions): Promise<string>;
  verify(hashStr: string, password: string): Promise<boolean>;
  which(hashStr: string): string | null;
  use(name: string): Object;
  list(): Array<string>;
  install(name: string, algorithm: IAlgorithmOptions): void;
  unistall(name: string): void;
}

interface IAlgorithmOptions {
  hash: Function;
  verify: Function;
  identifiers: Function;
}

export interface UpashOptions {
  name: string;
  algorithm: IAlgorithmOptions;
}

export interface HashOptions {
  variant?: number;
  iterations?: number;
  memory?: number;
  parallelism?: number;
  saltSize?: number;
}

export interface UpashOptionsFactory {
  createUpashOptions(): Promise<UpashOptions> | UpashOptions;
}

export interface UpashOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<UpashOptionsFactory>;
  useClass?: Type<UpashOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<UpashOptions> | UpashOptions;
  inject?: any[];
}
