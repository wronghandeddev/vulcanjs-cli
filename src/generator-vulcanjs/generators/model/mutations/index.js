const VulcanGenerator = require('../../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing () {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments () {
    this._registerOptions(
      'packageName',
      'modelName'
    );
  }

  prompting () {
    if (!this._canPrompt()) { return false; }
    const questions = this._getQuestions(
      'packageNameWithNumModelsList',
      'modelNameList'
    );
    return this.prompt(questions)
    .then((answers) => {
      this.props = {
        packageName: this._finalize('packageName', answers),
        modelName: this._finalize('modelName', answers),
        collectionName: this._finalize('collectionName', answers),
        newMutationName: this._finalize('mutationName', 'new', answers),
        editMutationName: this._finalize('mutationName', 'edit', answers),
        removeMutationName: this._finalize('mutationName', 'remove', answers),
        newPermission: this._finalize('permissionName', ['new'], answers),
        editOwnPermission: this._finalize('permissionName', ['edit', 'own'], answers),
        editAllPermission: this._finalize('permissionName', ['edit', 'all'], answers),
        removeOwnPermission: this._finalize('permissionName', ['remove', 'own'], answers),
        removeAllPermission: this._finalize('permissionName', ['remove', 'all'], answers),
      };
    });
  }

  _writeMutations () {
    this.fs.copyTpl(
      this.templatePath('mutations.js'),
      this._getPath(
        { isAbsolute: true },
        'model',
        'mutations.js'
      ),
      this.props
    );
  }

  _writeTestMutations () {
    const testProps = {
      ...this.props,
      subjectName: 'mutations',
      subjectPath: `../../../lib/models/${this.props.modelName}/mutations`,
    };
    this.fs.copyTpl(
      this.templatePath('../../templates/generic-test.js'),
      this._getPath(
        { isAbsolute: true },
        'modelTest',
        'mutations.spec.js'
      ),
      testProps
    );
  }

  writing () {
    if (!this._canWrite()) { return; }
    this._writeMutations();
    this._writeTestMutations();
  }

  end () {
    this._end();
  }
};
