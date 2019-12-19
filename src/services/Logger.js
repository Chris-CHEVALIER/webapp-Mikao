/**
 * A basic logger to encapsulate the console.log.
 * It log stuff only on DEBUG mode.
 */

const isLoggerEnabled = process.env.NODE_ENV !== 'production';
class Logger {
    log(...messages){
        if(isLoggerEnabled){
            console.log(...messages);
        }
    }

    error(...messages){
        if(isLoggerEnabled){
            console.error('[ERROR]', ...messages);
        }
    }
}

export default new Logger();
