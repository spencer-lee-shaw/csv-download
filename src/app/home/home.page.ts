import { Component } from '@angular/core';
import { Filesystem, FileWriteOptions, Directories, Encodings } from '@ionic-enterprise/filesystem/IonicFilesystem';
import { Platform, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private exportMessage: string;
  private self = this;

  constructor(private filesystem: Filesystem,
              private platform: Platform,
              private toastController: ToastController) {}

  public saveCsvFile() {
    const fileName = 'foo';
    const data = [
    ['555', '888', '731'],
     [5, 7, 3],
     [true, false, 'foo']
     ];
    const temp = this.toCsv(data);
    const csvFile = new Blob([temp], {type: 'text/csv'});

    if (this.platform.is('cordova')) {
      this.downloadFileOnMobileDevice(csvFile, fileName);
     } else {
      this.downloadFileOnWebBrowser(csvFile, fileName);
     }
  }

  private downloadFileOnMobileDevice(csvFile: Blob, fileName: string) {
    const reader = new FileReader();
    const fs = this.filesystem;
    const self = this.self;
    reader.onload = function() {
      console.log('writing');
      const filewriteoptions: FileWriteOptions = {
      data: reader.result.toString(),
      path: fileName + '.csv',
      directory: Directories.Documents,
      encoding: Encodings.UTF8
      };
      fs.writeFile(filewriteoptions)
      .then(function() {
        self.exportMessage = `Downloaded ${fileName} to the Documents folder.`;
        self.presentDownloadCsvToast();
      })
      .catch(function() {
        self.exportMessage = `Something went wrong. Could not export  to Csv.`;
        self.presentDownloadCsvToast();
      });
    };
    reader.readAsText(csvFile);
  }

  private downloadFileOnWebBrowser(csvFile: Blob, fileName: string) {
    const data = window.URL.createObjectURL(csvFile);
    const link = document.createElement('a');
    link.href = data;
    link.download = fileName + '.csv';
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    window.URL.revokeObjectURL(data);
    link.remove();
  }

  async presentDownloadCsvToast() {
    const toast = await this.toastController.create({
      message: this.exportMessage,
      duration: 5000
    });
    toast.present();
  }

   private  toCsv(temp) {
     return temp.map(row => row.join(',')).join('\n');
   }

}
