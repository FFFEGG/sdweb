export default function printpdf(id) {
     let printContents = document.getElementById(id).innerHTML;
     let originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}
