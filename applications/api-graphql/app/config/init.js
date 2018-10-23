/* Initializer
 * A place to put initializer code that needs to be run before anything else.
 * Since some initializer code is sequence-dependent, we need to require each
 * module here manually rather than auto-loading everything in here.j
 */

// Load environment variables
import './environment';

// Add Internationalization
import './i18n';
