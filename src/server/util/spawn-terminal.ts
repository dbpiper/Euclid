import { spawn, SpawnOptions } from 'child_process';

const spawnWithStringParser = (shellCommand: string) => {
  const shellCommandArray = shellCommand.split(' ');
  return {
    command: shellCommandArray[0],
    args: shellCommandArray.slice(1),
  };
};

const spawnTerminal = (
  command: string,
  options: SpawnOptions = {
    stdio: 'inherit',
    shell: true,
  },
) => {
  const commandObj = spawnWithStringParser(command);
  return spawn(commandObj.command, commandObj.args, options);
};

export default spawnTerminal;
